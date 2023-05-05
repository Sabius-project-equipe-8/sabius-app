import { ListStyled } from "./ListStyled";
import { Posts } from "../posts/Posts";
import { BtnStyled } from "./ListStyled";
import { useContext } from "react";
import { AdminContext } from "../../providers/AdminContext";
import { StyledSection } from "./ListStyled";

export const List = () => {
  const { postsList, openModal, search, filterSearch } =
    useContext(AdminContext);
  const currentPost = search !== "" ? filterSearch : postsList;

  return (
    <StyledSection>
      <div className="divButtonAdd">
      <BtnStyled onClick={() => openModal("Create")}>
        <img src="/src/assets/add.svg" />
      </BtnStyled>
      </div>
      <ListStyled>
        {currentPost.map((post) => (
          <Posts key={post.id} post={post} />
        ))}
      </ListStyled>
    </StyledSection>
  );
};
