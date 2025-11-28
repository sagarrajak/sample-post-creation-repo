export interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  live: boolean;
  created_at: Date;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  live?: boolean;
}

export interface UpdateReactionRequest {
  action: 'like' | 'dislike';
}