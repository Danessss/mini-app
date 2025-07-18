import { Link, useLocation } from "wouter";
import { Nav } from "react-bootstrap";
import {
  BarChart3,
  Building,
  Users,
  Puzzle,
  TrendingUp,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Companies", icon: Building },
  { href: "/integrations", label: "Integrations", icon: Puzzle },

];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div
      className="d-flex flex-column align-items-center position-fixed start-0 py-4"
      style={{
        width: "84px",
        backgroundColor: "#0B5160",
        top: "60px",
        height: "calc(100vh - 60px)",
      }}
    >
      <Nav className="flex-column w-100 align-items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Nav.Item key={item.href} className="mb-4 text-center">
              <a
                className="d-flex flex-column align-items-center text-decoration-none"
                style={{
                  color: isActive ? "#F3B126" : "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none", 
                }}
              >
                <Icon size={20} className="mb-1" />
                {item.label}
              </a>
            </Nav.Item>
          );
        })}
      </Nav>
    </div>
  );
}
