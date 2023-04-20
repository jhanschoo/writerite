import router from 'next/router';
import { Breadcrumbs, Button, Divider, Group, GroupProps, Text } from '@mantine/core';
import Link from 'next/link';

export interface BreadcrumbsNavProps {
  showBack?: boolean;
  breadcrumbs?: [string, string | JSX.Element][];
  groupProps?: GroupProps;
}

const BreadcrumbsNav = ({ showBack, breadcrumbs, groupProps }: BreadcrumbsNavProps) => {
  const handleBack = async () => {
    router.back();
  };
  const breadcrumbLinks =
    breadcrumbs &&
    breadcrumbs.length &&
    breadcrumbs.map(([href, name], index) => (
      <Link key={index} href={href}>
        {typeof name === 'string' ? <Text>{name}</Text> : name}
      </Link>
    ));
  return (
    <Group {...groupProps}>
      {showBack && (
        <Button onClick={handleBack} sx={{ minWidth: 0 }}>
          Back
        </Button>
      )}
      {showBack && breadcrumbLinks && <Divider orientation="vertical" />}
      {breadcrumbLinks && <Breadcrumbs separator="»">{breadcrumbLinks}</Breadcrumbs>}
    </Group>
  );
};

export default BreadcrumbsNav;
