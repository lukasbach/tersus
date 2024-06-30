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
        const { id } = await createDashboard({
          widgets: {},
          layouts: {},
          title: "My new dashboard",
          lastEdit: Date.now(),
        });
        navigate({ to: boardViewRoute.fullPath, params: { id } });
      }}
    >
      Create Dashboard
    </Button>
  );
};
