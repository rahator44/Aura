<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::where(function ($q) {
            $q->whereHas('user', function ($q2) {
                $q2->where('is_subscribed', true)->orWhere('role', 'admin');
            })->orWhereNull('user_id');
        });

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        $events = $query->latest()->paginate(9);
        
        return response()->json(['success' => true, 'events' => $events]);
    }

    public function getCategories()
    {
        $categories = Event::whereNotNull('category')->select('category')->distinct()->pluck('category');
        return response()->json(['success' => true, 'categories' => $categories]);
    }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'location' => 'required|string|max:255',
            'image' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'category' => 'nullable|string|max:100',
            'city_country' => 'required|string|max:255',
            'is_featured' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['user_id'] = auth()->id();
        $event = Event::create($data);
        if (auth()->check()) {
            \App\Services\ActivityLogger::log(auth()->id(), 'CREATE_EVENT');
        }

        // Notify Admins
        $user = auth()->user();
        $admins = \App\Models\User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            if ($user && $admin->id === $user->id) continue;
            \App\Models\Notification::create([
                'user_id' => $admin->id,
                'title'   => '🔔 New Event Created',
                'message' => 'A new event "' . $event->title . '" has been created by ' . ($user ? $user->name : 'Unknown'),
                'type'    => 'info',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'event' => $event
        ], 201);
    }

    public function show(Event $event)
    {
        if (auth('api')->check()) {
            \App\Services\ActivityLogger::log(auth('api')->id(), 'VIEW_EVENT');
        }
        return response()->json(['success' => true, 'event' => $event]);
    }

    public function update(Request $request, Event $event)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'price' => 'numeric|min:0',
            'capacity' => 'integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $event->update($request->all());
        if (auth('api')->check()) {
            \App\Services\ActivityLogger::log(auth('api')->id(), 'UPDATE_EVENT');
        }

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        if (auth('api')->check()) {
            \App\Services\ActivityLogger::log(auth('api')->id(), 'DELETE_EVENT');
        }
        return response()->json(['success' => true, 'message' => 'Event deleted successfully']);
    }
}
