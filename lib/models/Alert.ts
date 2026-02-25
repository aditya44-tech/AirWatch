import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    city: string;
    level: 'Low' | 'Medium' | 'High' | 'Hazardous';
    message: string;
    aqi: number;
    createdAt: Date;
    read: boolean;
}

const AlertSchema = new Schema<IAlert>({
    city: { type: String, required: true },
    level: { type: String, enum: ['Low', 'Medium', 'High', 'Hazardous'], required: true },
    message: { type: String, required: true },
    aqi: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
});

export default mongoose.models.Alert ||
    mongoose.model<IAlert>('Alert', AlertSchema);
