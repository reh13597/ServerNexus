export interface ReviewInfo {
    id: number;
    user_id: string;
    server_id: number;
    username: string;
    avatar: string | null;
    rating: number;
    review: string;
}