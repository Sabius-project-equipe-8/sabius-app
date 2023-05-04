import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";
interface ICartProviderProps {
  children: React.ReactNode;
}

export interface IPost {
  id: number;
  title: string;
  description: string;
  like?: number;
  techCategory: string;
  postImage: string;
  link: string;
  userId: number;
}

interface IAdminContext {
  createPost: (formData: IPost) => void;
  editPost: (id: number, formData: IPost) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  postsList: IPost[];
  filterSearch: IPost[];
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  isOpen: IModalText;
  setIsOpen: React.Dispatch<React.SetStateAction<IModalText>>;
  closeModal: () => void;
  openModal: (modal: IModalText) => void;
  deleteCard: (cardId: any) => void;
  post: IPost | null;
}

type IModalText = undefined | "Create" | "Delete" | "Edit";

export const AdminContext = createContext({} as IAdminContext);

export const AdminProvider = ({ children }: ICartProviderProps) => {
  const [postsList, setPostsList] = useState<IPost[]>([]);
  const [isOpen, setIsOpen] = useState<IModalText>(undefined);
  const [search, setSearch] = useState("");
  const [post, setPost] = useState<IPost | null>(null);
  // const [filteredCategory, setFilteredCategory] = useState<IPost[]>([]);

  const closeModal = () => setIsOpen(undefined);
  const openModal = (modal: IModalText) => setIsOpen(modal);

  const filterSearch = postsList.filter(
    (post) =>
      post.title.toLowerCase().includes(search) ||
      post.techCategory.toLowerCase().includes(search)
  );

  useEffect(() => {
    const token = localStorage.getItem("@TOKEN:SABIUS");
    const loadPosts = async () => {
      try {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        const { data } = await api.get<IPost[]>("/posts");
        setPostsList(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadPosts();
  }, []);

  const createPost = async (formData: IPost) => {
    const token = localStorage.getItem("@TOKEN:SABIUS");
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const response = await api.post<IPost>("/posts", formData);
      setPostsList([...postsList, response.data]);
      setIsOpen(undefined);
      console.log("Requisição feita com sucesso");
    } catch (error) {
      console.error(error);
    }
  };

  const editPost = async (id: number, formData: IPost) => {
    const token = localStorage.getItem("@TOKEN:SABIUS");
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      await api.patch(`posts/${id}`, formData);
      const newPosts = postsList.filter((post) => post.id !== id);
      setPostsList([...newPosts, formData]);
      console.log("Post editado com sucesso");
      setIsOpen(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id: number) => {
    const token = localStorage.getItem("@TOKEN:SABIUS");
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      await api.delete(`posts/${id}`);
      console.log("Post deletado com sucesso");
      setIsOpen(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCard = (cardId: number) => {
    const postFound = postsList.find((post) => post.id === cardId)!;
    setPost(postFound);
    setIsOpen("Delete");
  };

  return (
    <AdminContext.Provider
      value={{
        postsList,
        deletePost,
        editPost,
        createPost,
        filterSearch,
        search,
        setSearch,
        isOpen,
        setIsOpen,
        openModal,
        closeModal,
        deleteCard,
        post,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
