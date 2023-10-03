interface ICard {
  front: string;
  back: string;
  tags: string[];
}

export interface CreateCardPayload extends ICard {
  author: string;
}

export interface UpdateCardPayload extends ICard {}
