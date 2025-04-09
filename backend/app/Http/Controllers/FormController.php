<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $forms = Form::latest()->paginate(10);

        return response()->json($forms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'fields' => 'required|array',
                'fields.*.id' => 'required|string',
                'fields.*.type' => 'required|string|in:text,textarea,select,checkbox,radio,email,phone,password,date',
                'fields.*.label' => 'required|string',
                'fields.*.required' => 'required|boolean',
                'fields.*.options' => 'nullable|array',
                'fields.*.options.*' => 'nullable|string',
                'is_published' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $form = Form::create($validator->validated());

            return response()->json($form, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $form = Form::findOrFail($id);

        return response()->json($form);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $form = Form::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'fields' => 'sometimes|required|array',
                'fields.*.id' => 'required|string',
                'fields.*.type' => 'required|string|in:text,textarea,select,checkbox,radio,email,phone,password,date',
                'fields.*.label' => 'required|string',
                'fields.*.required' => 'required|boolean',
                'fields.*.options' => 'nullable|array',
                'fields.*.options.*' => 'nullable|string',
                'is_published' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $form->update($validator->validated());

            return response()->json($form);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update form',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $form = Form::findOrFail($id);
        $form->delete();

        return response()->json(null, 204);
    }
}
