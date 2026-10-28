import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Layout() {


    const { user, status, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }


    return (


        <div >
            <header>
                <nav>
                    <NavLink to="/" >הלוח שלי</NavLink>
                    {" | "}
                    <NavLink to="/groups" >הקבוצות שלי</NavLink>
                    {" | "}
                    <NavLink to="/profile" >הפרופיל שלי</NavLink>
                </nav>
                <div>
                    {status==="authenticated"&&user&&(
                        <>
                        <span>שלום, {user.fullName}</span>
                        <button onClick={handleLogout}>התנתקות</button>
                        </>
                    )}
                </div>
            </header>


            <main>
                <Outlet />
            </main>
        </div>




    )
}
export default Layout