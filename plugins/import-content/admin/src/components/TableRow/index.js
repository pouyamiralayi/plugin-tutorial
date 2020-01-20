import styled from "styled-components";
import {colors} from 'strapi-helper-plugin'

const Row = styled.li`
  width:100%;
  padding-top: 18px;
  &.clickable {
    &:hover {
      cursor: pointer;
      background-color: ${colors.grey};
      & + tr {
        &::before {
          background-color: transparent;
        }
      }
    }
  }
`;

export default Row;
