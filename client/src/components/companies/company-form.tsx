import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Button, Badge, Spinner, Row, Col } from "react-bootstrap";
import { X } from "lucide-react";
import { useToasts } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  insertCompanySchema,
  type Company,
  type InsertCompany,
  type Integration,
} from "@shared/schema";
import { availableIntegrations } from "@/lib/integrations";

interface CompanyFormProps {
  company?: Company;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CompanyForm({
  company,
  onSuccess,
  onCancel,
}: CompanyFormProps) {
  const { addToast } = useToasts();
  const queryClient = useQueryClient();
  const [selectedIntegrations, setSelectedIntegrations] = useState<
    Integration[]
  >(company?.integrations || []);

  const form = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: {
      companyName: company?.companyName || "",
      integrations: company?.integrations || [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      const response = await apiRequest("POST", "/api/companies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      addToast({ title: "Success", description: "Company created successfully" });
      onSuccess();
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to create company",
        variant: "danger",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      const response = await apiRequest(
        "PUT",
        `/api/companies/${company!.id}`,
        data
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      addToast({ title: "Success", description: "Company updated successfully" });
      onSuccess();
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to update company",
        variant: "danger",
      });
    },
  });

  const removeIntegration = (integrationName: string) => {
    const newIntegrations = selectedIntegrations.filter(
      (i) => i.integrationName !== integrationName
    );
    setSelectedIntegrations(newIntegrations);
    form.setValue("integrations", newIntegrations);
  };

  const onSubmit = (data: InsertCompany) => {
    const formData = { ...data, integrations: selectedIntegrations };
    if (company) updateMutation.mutate(formData);
    else createMutation.mutate(formData);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>
          Company Name <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter company name"
          isInvalid={!!form.formState.errors.companyName}
          {...form.register("companyName")}
        />
        <Form.Control.Feedback type="invalid">
          {form.formState.errors.companyName?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Integrations</Form.Label>
        <Form.Select
          value=""
          onChange={(e) => {
            const selected = e.target.value;
            if (
              selected &&
              !selectedIntegrations.some((i) => i.integrationName === selected)
            ) {
              const integration = availableIntegrations.find(
                (i) => i.integrationName === selected
              );
              if (integration) {
                const newIntegrations = [...selectedIntegrations, integration];
                setSelectedIntegrations(newIntegrations);
                form.setValue("integrations", newIntegrations);
              }
            }
          }}
        >
          <option value="">Select an integration</option>
          {availableIntegrations
            .filter(
              (integration) =>
                !selectedIntegrations.some(
                  (selected) =>
                    selected.integrationName === integration.integrationName
                )
            )
            .map((integration) => (
              <option
                key={integration.integrationName}
                value={integration.integrationName}
              >
                {integration.integrationName}
              </option>
            ))}
        </Form.Select>

        <div className="mt-3 d-flex flex-wrap gap-2">
          {selectedIntegrations.map((integration) => (
            <Badge
              key={integration.integrationName}
              bg="secondary"
              className="d-flex align-items-center gap-1"
            >
              {integration.integrationName}
              <Button
                variant="light"
                size="sm"
                className="p-0 ms-1"
                onClick={() => removeIntegration(integration.integrationName)}
              >
                <X size={12} />
              </Button>
            </Badge>
          ))}
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2 border-top pt-3">
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Spinner animation="border" size="sm" className="me-2" />
          )}
          {company ? "Save" : "Create"}
        </Button>
      </div>
    </Form>
  );
}
