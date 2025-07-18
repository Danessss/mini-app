import { Navbar, Container } from "react-bootstrap";
import logo from "./logo.png";

export function Topbar() {
  return (
    <Navbar
      bg="white"
      expand="lg"
      className="border-bottom shadow-sm fixed-top px-4"
      style={{ height: "64px" }}
    >
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* Left: Logo */}
        <div className="d-flex align-items-center gap-2">
          <img src={logo} alt="Logo" style={{ height: "36px" }} />
        </div>

        {/* Right: Circular Icon with Initials */}
        <div
          className="text-white fw-semibold d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#0B5160",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            fontSize: "14px",
          }}
        >
          MS
        </div>
      </Container>
    </Navbar>
  );
}
