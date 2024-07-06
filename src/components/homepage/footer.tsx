import { ActionIcon, Anchor, Container, Group, Text, rem } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandMedium,
  IconLayoutBoard,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import classes from "./footer.module.css";
import { links } from "../../pagedata.ts";

const data = [
  {
    title: "Project",
    links: [{ label: "Github Project", link: links.github }],
  },
  {
    title: "More from me",
    links: [
      { label: "My GitHub profile", link: links.social.github },
      { label: "My Medium profile", link: links.social.medium },
      { label: "My LinkedIn", link: links.social.linkedin },
      { label: "Sponsor me", link: links.sponsor },
    ],
  },
];

export function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link) => (
      <Text<"a">
        key={link.link}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <IconLayoutBoard />
          <Text size="xs" c="dimmed" className={classes.description}>
            Tersus
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2024{" "}
          <Anchor
            component={Link}
            to={links.social.web}
            target="_blank"
            rel="noopener noreferrer"
          >
            Lukas Bach
          </Anchor>
          . All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            component={Link}
            to={links.social.medium}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandMedium
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            component={Link}
            to={links.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandLinkedin
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon
            size="lg"
            color="gray"
            variant="subtle"
            component={Link}
            to={links.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconBrandGithub
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
