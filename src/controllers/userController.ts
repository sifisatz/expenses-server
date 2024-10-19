import { z } from "@hono/zod-openapi";
import { CreateUserSchema, User } from "../schemas/user";
import { users, wishes } from "../db";


// Function to create a new user
export const createUser = async (request: any): Promise<Response> => {
  try {
    const body = await request.json(); // Parse the JSON body

    // Validate the request body against CreateUserSchema
    const parsedBody = CreateUserSchema.parse(body); // Validate and parse using Zod

    // Create a new user with a unique ID
    const newUser: User = {
      id: users.length + 1,
      ...parsedBody,
    };

    users.push(newUser); // Add to the in-memory database
    return new Response(JSON.stringify(newUser), { status: 201 }); // Return the new user
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: error.errors }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500 }
    );
  }
};


// Function to get all users
export const getAllUsers = async (): Promise<any> => {
    return new Response(JSON.stringify(users), { status: 200 });
  };
  


  // Function to get all wishes associated with a specific user
export const getWishesByUserId = async (userId: number): Promise<Response> => {
    console.log('userDIR', userId);
    // Check if the user exists
    const userExists = users.find(user => user.id === userId);
    if (!userExists) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
  
    // Fetch wishes linked to the user
    const userWishes = wishes.filter(wish => wish.userId === userId);
    
    // If no wishes are found, return a 404
    if (userWishes.length === 0) {
      return new Response(JSON.stringify({ message: "No wishes found for this user" }), { status: 404 });
    }
  
    return new Response(JSON.stringify(userWishes), { status: 200 });
  };