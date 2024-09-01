import http from "@/axios-client";
import {
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/auth-context";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    User,
    UserPlus,
    Users,
} from "lucide-react";
import { useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";

export const links = [
    { name: "Dashboard", href: "/" },
    { name: "Surveys", href: "/surveys" },
];

const DefaultLayout = () => {
    const { authToken, currentUser, setAuthToken, setCurrentUser } =
        useAuthContext();

    if (!authToken) return <Navigate to="/login" />;

    const [dropDownToggle, setDropDownToggle] = useState(false);

    async function logout() {
        try {
            const response = await http.post("logout");
            if (response.status === 204) {
                setCurrentUser(null);
                setAuthToken(null);
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <header className="flex items-center h-20 border-b px-4 justify-between">
                <section className="flex h-full w-full items-center">
                    <h1
                        className="text-primary text-4xl"
                        style={{ fontFamily: "cursive" }}
                    >
                        Algorivex
                    </h1>
                    <nav className="flex items-center px-6 py-2 gap-6 text-xl">
                        {links.map((link) => {
                            return (
                                <ul key={link.href}>
                                    <NavLink
                                        to={link.href}
                                        className={({ isActive }) =>
                                            [
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-none",
                                                "h-full w-full rounded-md px-3 py-2 transition-all duration-300",
                                            ].join(" ")
                                        }
                                    >
                                        {link.name}
                                    </NavLink>
                                </ul>
                            );
                        })}
                    </nav>
                </section>
                <DropdownMenu
                    open={dropDownToggle}
                    onOpenChange={() => setDropDownToggle(!dropDownToggle)}
                >
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <h1
                                className={`
                                    ${
                                        dropDownToggle
                                            ? "text-xl text-blue-500"
                                            : ""
                                    }
                                        " text-xl group-hover:text-blue-500 transition-all duration-300"`}
                            >
                                @{currentUser?.name}
                            </h1>
                            <h1
                                className={`
                                    ${dropDownToggle ? " bg-blue-500" : ""}
" rounded-full bg-primary h-full w-full p-2 text-primary-foreground group-hover:bg-blue-500 transition-all duration-300"`}
                            >
                                <User />
                            </h1>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>
                                Comming soon...
                            </DropdownMenuLabel>
                            <DropdownMenuItem disabled>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Team</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger disabled>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    <span>Invite users</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>
                                            <Mail className="mr-2 h-4 w-4" />
                                            <span>Email</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            <span>Message</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            <span>More...</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem disabled>
                                <Plus className="mr-2 h-4 w-4" />
                                <span>New Team</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main className="min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] w-full overflow-y-scroll">
                <Outlet />
            </main>
        </>
    );
};

export default DefaultLayout;
