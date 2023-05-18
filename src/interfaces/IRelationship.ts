import { Model, Document } from "mongoose";

interface Relationship {
  partner: string;
  relationshipType: string;
}

export interface RelationshipDocument extends Relationship, Document {}

export interface RelationshipModel extends Model<RelationshipDocument> {}
