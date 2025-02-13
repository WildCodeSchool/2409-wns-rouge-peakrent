export type AdType = {
  category: Category;
  created_at: Date;
  id: number;
  location: string;
  owner: string;
  picture: string;
  price: number;
  tags: Tag[];
  description?: string;
  title: string;
  author: string;
};

export type Category = {
  id: number;
  name: string;
  ads?: AdType[];
};

export type Tag = {
  id: number;
  name: string;
  ads?: AdType[];
};
