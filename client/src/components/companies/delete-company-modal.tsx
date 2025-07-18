import { Modal, Button, Alert } from "react-bootstrap";
import { useToasts } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Company } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

interface DeleteCompanyModalProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteCompanyModal({
  company,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCompanyModalProps) {
  const { addToast } = useToasts();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/companies/${company.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      addToast({
        title: "Success",
        description: "Company deleted successfully.",
        variant: "success",
      });
      onSuccess();
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete company.",
        variant: "danger",
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Modal show={open} onHide={() => onOpenChange(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger d-flex align-items-center gap-2">
          <AlertTriangle size={18} />
          Remove Company
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this company?</p>
    
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending && (
            <span className="spinner-border spinner-border-sm me-2" role="status" />
          )}
          Yes, remove it
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
