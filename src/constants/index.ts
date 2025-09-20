import { AccountBox, Home, Settings } from "@mui/icons-material";
import { FaUserDoctor, FaUsers, FaUserTie } from "react-icons/fa6";

export const sidebar=[
    {name:"Dashboard", route:"/dashboard", icon:Home},
    {name:"Profile", route:"/admin-profile", icon:AccountBox},
    {name:"Doctors", route:"/doctors", icon:FaUserDoctor},
    {name:"Receptions", route:"/receptions", icon:FaUserTie},
    {name:"Patients", route:"/patients", icon:FaUsers},
    {name:"Settings", route:"/settings", icon:Settings},
]