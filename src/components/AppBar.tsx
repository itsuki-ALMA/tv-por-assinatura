'use client';

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Link from 'next/link';

export default function CustomAppBar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpen(open);
  };

  const menuItems = [
    { label: 'Clientes', path: '/clientes' },
    { label: 'Planos', path: '/planos' },
    { label: 'Serviços Adicionais', path: '/servicos-adicionais' },
    { label: 'Pacotes', path: '/pacotes' },
    { label: 'Assinaturas', path: '/assinaturas' },
    { label: 'pagamento', path: '/pagamento' },
  ];

  return (
    <>
      <AppBar position="static" color="primary" elevation={3}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Nome do site */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            ACME
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Link para página de serviços */}
            <Button color="inherit" sx={{ fontWeight: 'bold' }} component={Link} href="/servicos">
              Conhecer nossos serviços
            </Button>

            {/* Botão de menu */}
            <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral com links */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component={Link} href={item.path}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
