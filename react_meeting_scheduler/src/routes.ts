// core components
import Profile from "./layouts/App/Profile";
import Tables from "./layouts/App/Tables";
import Copyright from "./components/Copyright";

import DashboardIcon from "@material-ui/icons/Dashboard";
import DateRangeIcon from "@material-ui/icons/DateRange";
import BarChartIcon from "@material-ui/icons/BarChart";
import PostAddIcon from "@material-ui/icons/PostAdd";
import CalendarForm from "./components/CalendarForm";
import ScheduleEvent from "./components/ScheduleEvent";

const routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: DashboardIcon,
    component: CalendarForm,
    layout: "/dashboard",
  },
  {
    path: "/events",
    name: "Events",
    icon: DateRangeIcon,
    component: Profile,
    layout: "/dashboard",
  },
  {
    path: "/schedule",
    name: "Schedule an event",
    icon: PostAddIcon,
    component: ScheduleEvent,
    layout: "/dashboard",
  },
  {
    path: "/reports",
    name: "Reports",
    icon: BarChartIcon,
    component: Copyright,
    layout: "/dashboard",
  },
];
export default routes;
