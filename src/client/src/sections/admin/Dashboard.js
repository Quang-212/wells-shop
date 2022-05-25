import { alpha, Grid } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';


export default function Dashboard() {
    const [open, setOpen] = React.useState(
        {
            status: false,
            index: null
        }
    );

    const handleClick = (i) => {
        setOpen(prev => {
            return {
                status: !prev.status,
                index: i
            }
        });
    };
    const sidebarList = [
        {
            title: "Product",
            icon: <FormatAlignRightIcon />,
            children: ["List", "Create",]
        },
        {
            title: "User",
            icon: <AssignmentIndIcon />,
            children: ["List", "Create",]
        },
    ]
    return (
        <Grid container spacing={2} sx={{ mt: 11 }}>
            <Grid item xl={2} lg={2} md={2} sx={{ bgcolor: alpha("#000", 0.1) }}>
                <List
                    sx={{ width: '100%', maxWidth: 360 }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Management
                        </ListSubheader>
                    }
                >
                    {sidebarList.map((item, i) =>
                        <div key={i}>
                            <ListItemButton onClick={() => { handleClick(i) }} >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                                {open.status && open.index === i ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open.status && open.index === i} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.children.map((item, i) =>
                                        <ListItemButton key={i} sx={{ pl: 4 }}>
                                            {/* <ListItemIcon>
                                            <StarBorder />
                                        </ListItemIcon> */}
                                            <ListItemText primary={item} />
                                        </ListItemButton>
                                    )}
                                </List>
                            </Collapse>
                        </div>
                    )}
                    <ListItemButton>
                        <ListItemIcon>
                            <ShoppingCartCheckoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Order" />
                    </ListItemButton>
                </List>
            </Grid>
            <Grid item xl={10} lg={10} md={10}>
                <Outlet />
            </Grid>
        </Grid>
    )
}
