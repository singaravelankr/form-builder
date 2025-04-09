<?php

use App\Models\Form;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->token = $this->user->createToken('test-token')->plainTextToken;
});

test('authenticated user can create a form', function () {
    $formData = [
        'title' => 'Test Form',
        'description' => 'This is a test form',
        'fields' => [
            [
                'id' => 'name',
                'type' => 'text',
                'label' => 'Full Name',
                'required' => true,
            ],
            [
                'id' => 'email',
                'type' => 'email',
                'label' => 'Email Address',
                'required' => true,
            ],
        ],
        'is_published' => true,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/forms', $formData);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'id',
            'title',
            'description',
            'fields',
            'is_published',
            'created_at',
            'updated_at',
        ]);

    $this->assertDatabaseHas('forms', [
        'title' => 'Test Form',
        'description' => 'This is a test form',
    ]);
});

test('form creation validates required fields', function () {
    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/forms', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title', 'fields']);
});

test('form creation validates field types', function () {
    $formData = [
        'title' => 'Test Form',
        'fields' => [
            [
                'id' => 'name',
                'type' => 'invalid_type',
                'label' => 'Full Name',
                'required' => true,
            ],
        ],
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->postJson('/api/forms', $formData);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['fields.0.type']);
});

test('authenticated user can list forms', function () {
    Form::factory()->count(3)->create(['user_id' => $this->user->id]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/forms');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'description',
                    'fields',
                    'is_published',
                    'created_at',
                    'updated_at',
                ],
            ],
            'current_page',
            'per_page',
            'total',
        ]);
});

test('authenticated user can get a specific form', function () {
    $form = Form::factory()->create(['user_id' => $this->user->id]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->getJson('/api/forms/' . $form->id);

    $response->assertStatus(200)
        ->assertJson([
            'id' => $form->id,
            'title' => $form->title,
        ]);
});

test('authenticated user can update a form', function () {
    $form = Form::factory()->create(['user_id' => $this->user->id]);

    $updateData = [
        'title' => 'Updated Form Title',
        'description' => 'Updated description',
        'fields' => [
            [
                'id' => 'name',
                'type' => 'text',
                'label' => 'Full Name',
                'required' => true,
            ],
        ],
        'is_published' => false,
    ];

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->putJson('/api/forms/' . $form->id, $updateData);

    $response->assertStatus(200)
        ->assertJson([
            'title' => 'Updated Form Title',
            'description' => 'Updated description',
        ]);

    $this->assertDatabaseHas('forms', [
        'id' => $form->id,
        'title' => 'Updated Form Title',
    ]);
});

test('authenticated user can delete a form', function () {
    $form = Form::factory()->create(['user_id' => $this->user->id]);

    $response = $this->withHeaders([
        'Authorization' => 'Bearer ' . $this->token,
    ])->deleteJson('/api/forms/' . $form->id);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Form deleted successfully',
        ]);

    $this->assertDatabaseMissing('forms', [
        'id' => $form->id,
    ]);
});

test('unauthenticated user cannot access form endpoints', function () {
    $form = Form::factory()->create();

    $this->getJson('/api/forms')->assertStatus(401);
    $this->postJson('/api/forms', [])->assertStatus(401);
    $this->getJson('/api/forms/' . $form->id)->assertStatus(401);
    $this->putJson('/api/forms/' . $form->id, [])->assertStatus(401);
    $this->deleteJson('/api/forms/' . $form->id)->assertStatus(401);
}); 