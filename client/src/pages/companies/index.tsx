import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Spinner,
  Card,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { Plus, Search } from "lucide-react";
import { CompanyTable } from "@/components/companies/company-table";
import { CompanyForm } from "@/components/companies/company-form";
import { DeleteCompanyModal } from "@/components/companies/delete-company-modal";
import { type Company } from "@shared/schema";

export default function CompaniesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [search, setSearch] = useState("");

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedCompany(null);
  };

  const filteredCompanies = companies.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="text-muted small">Companies</div>
          <h4 className="fw-bold mb-0">Companies ({companies.length})</h4>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          style={{ backgroundColor: "#0B5160", borderColor: "#0B5160" }}
        >
          <Plus size={16} className="me-2" />
          Add Company
        </Button>
      </div>

      <Card className="mb-3 border-0 shadow-sm rounded-3 bg-white">
        <Card.Body className="p-3">
          <div className="d-flex justify-content-end">
            <InputGroup style={{ maxWidth: "300px" }}>
              <InputGroup.Text
                className="text-white border-0 rounded-start"
                style={{ backgroundColor: "#0B5160" }} 
              >
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-start-0 rounded-end"
                style={{
                  border: "1px solid #0B5160", 
                  borderLeft: "none",
                  borderTopRightRadius: "0.375rem",
                  borderBottomRightRadius: "0.375rem",
                  boxShadow: "none",
                }}
              />
            </InputGroup>
          </div>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <CompanyTable
              companies={filteredCompanies}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Card.Body>
      </Card>

      {/* Add Modal */}
      <Modal show={isAddDialogOpen} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>Create Company</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CompanyForm
            onSuccess={handleCloseModals}
            onCancel={handleCloseModals}
          />
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={isEditDialogOpen} onHide={handleCloseModals}>
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Company - {selectedCompany?.companyName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCompany && (
            <CompanyForm
              company={selectedCompany}
              onSuccess={handleCloseModals}
              onCancel={handleCloseModals}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      {selectedCompany && (
        <DeleteCompanyModal
          company={selectedCompany}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={handleCloseModals}
        />
      )}
    </div>
  );
}
