export interface CommentDBType {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
  postId: string;
}

export type CommentView = Omit<CommentDBType, 'postId'>;
