import mongoose, {Model, Document} from "mongoose"

interface Story {
    title: string,
    event: string,
    characters: mongoose.Types.ObjectId[]
    places: mongoose.Types.ObjectId[]
}

export interface StoryDocument extends Story, Document {}

export interface StoryModel extends Model<StoryDocument> {}
