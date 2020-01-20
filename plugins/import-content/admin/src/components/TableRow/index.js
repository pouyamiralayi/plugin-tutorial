import styled from "styled-components";
import {colors} from 'strapi-helper-plugin'

const Row = styled.li`
  span {
    font-weight: ${({selected}) => (selected ? 'bold' : "normal")}
  }
  background-color:${({selected}) => (selected ? colors.leftMenu.lightGrey : "")};
  width:100%;
  padding-top: 18px;
  &.clickable {
    &:hover {
      cursor: pointer;
      background-color: ${({selected}) => (selected ? "" : colors.grey)};
      & + tr {
        &::before {
          background-color: transparent;
        }
      }
    }
  }
`;

export default Row;
