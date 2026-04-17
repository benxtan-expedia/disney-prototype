import { NavBar, NavItem, Logo } from "./Nav.styled";

const Nav = () => (
  <NavBar>
    <Logo>🏰</Logo>
    <NavItem to="/" end>
      Illustrated Map
    </NavItem>
    <NavItem to="/map2">
      Google Map
    </NavItem>
  </NavBar>
);

export default Nav;
