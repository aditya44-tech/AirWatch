import mongoose, { Schema, Document } from 'mongoose';

export interface IAqiHistory extends Document {
    city: string;
    lat: number;
    lon: number;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
    o3: number;
    timestamp: Date;
}

const AqiHistorySchema = new Schema<IAqiHistory>({
    city: { type: String, required: true, index: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    aqi: { type: Number, required: true },
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    no2: { type: Number, required: true },
    co: { type: Number, required: true },
    o3: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
});

export default mongoose.models.AqiHistory ||
    mongoose.model<IAqiHistory>('AqiHistory', AqiHistorySchema);
