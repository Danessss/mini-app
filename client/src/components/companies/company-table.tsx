import { Table, Button } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import { type Company } from "@shared/schema";
import googleCloud from "./google_icon.png";
import microsoft from "./ms_office_icon.png";
import bitbucket from "./azure-devops-logo.png";
import oracle from "./JiraIcon.png";
import defaultIcon from "../layout/logo.png";

const integrationIcons: Record<string, string> = {
  "Google Cloud":
    "https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/google-cloud.png",
  Bitbucket:
    "https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/bitbucket.png",
  Jira: "https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/jira.png",
  Trello:
    "https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/trello.png",
  Oracle:
    "https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/oracle-logo.png",
  Microsoft:
    "https://s3.us-west-2.amazonaws.com/cdn.saasconsole.com/static/img/integrations/microsoft-office.png",
};

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

export function CompanyTable({
  companies,
  onEdit,
  onDelete,
}: CompanyTableProps) {
  return (
    <div className="border-top">
      <Table hover responsive className="align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th className="ps-4">Name</th>
            <th>Integrations</th>
            <th className="text-end pe-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const initials = company.companyName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <tr key={company.id}>
                <td className="ps-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="text-white d-flex justify-content-center align-items-center fw-semibold"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        backgroundColor: "#0B5160",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="fw-semibold text-dark">
                      {company.companyName}
                    </div>
                  </div>
                </td>
                <td>
                  <td>
                    {company.integrations && company.integrations.length > 0 ? (
                      company.integrations.map((integration, index) => (
                        <div
                          key={index}
                          className="d-inline-flex align-items-center me-3 mb-1"
                          style={{ minWidth: "100px" }}
                        >
                          <img
                            src={integration.integrationLogo || defaultIcon}
                            alt={integration.integrationName}
                            title={integration.integrationName}
                            style={{
                              height: "20px",
                              width: "20px",
                              objectFit: "contain",
                              marginRight: "6px",
                            }}
                          />
                          <span className="small">
                            {integration.integrationName}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-muted small">--</span>
                    )}
                  </td>
                </td>
                <td className="text-end pe-4">
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(company)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(company)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
