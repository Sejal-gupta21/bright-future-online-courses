export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string; // New field for detailed description
  price: number;
  imageUrl: string;
  instructor: string;
  rating: number;
  students: number;
  category: string;
  lastUpdatedDate: string; // New field
  language: string;        // New field
  subtitles: string[];     // New field
  numRatings: number;      // New field
  provider: string;        // New field
  isPremium: boolean;      // New field
  originalPrice: number;   // New field
  discountPercentage: number; // New field
  keyLearningPoints: string[]; // New field
  requirements: string[];    // New field
  whoIsFor: string[];        // New field
}