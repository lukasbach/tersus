import { FC } from "react";
import { Button } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { createDashboard } from "../firebase/app.ts";
import { boardViewRoute } from "../router.tsx";

export const HomePage: FC = () => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={async () => {
        const { id } = await createDashboard({});
        navigate({ to: boardViewRoute.path, params: { id } });
      }}
    >
      Create Dashboard
    </Button>
  );
};
