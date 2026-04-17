import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 52px;
  background: #07164a;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
`;

export const Logo = styled.span`
  font-size: 20px;
  margin-right: 16px;
`;

export const NavItem = styled(NavLink)`
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 20px;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    color: white;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    color: white;
    background: rgba(255, 255, 255, 0.15);
  }
`;
