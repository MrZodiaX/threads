'use server'

import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { connectToDB } from '../moongose'

interface Params {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}
// using this interface Params for passing values, we dont need to take care of 
// order when passing values 
export async function updateUser ({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  // Promise<void> specifies that this function returns a promise that resolves to void, meaning it doesn't return any meaningful value.
  connectToDB()
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      { upsert: true }
    // both update and insert
    )

    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user :${error.message}`)
  }
}

export async function fetchUser(userId: string){
  try{
    connectToDB();

    return await User.findOne({id : userId})
    //.populate({
    //  path: 'communities',
    //  model: Community
    //})
  }
  catch (error: any){
    console.log("error fetch user")
    throw new Error(`Failed to fetch user : ${error.message}`)
  }
}