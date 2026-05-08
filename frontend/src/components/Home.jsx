import React, { useEffect, useState } from 'react';
import './Home.css';
import { apibaseurl, callApi, imgurl } from '../lib';
import ProgressBar from './ProgressBar';

const Home = () => {
    const [fullname, setFullname] = useState("");
    const [isProgress, setIsProgress] = useState("");
    const [activeMenu, setActiveMenu] = useState("Roles");
    const [roleName, setRoleName] = useState("");
    const [menuName, setMenuName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedMenus, setSelectedMenus] = useState([]);
    const sideMenus = [
        { menu: "Dashboard", icon: "dashboard.png" },
        { menu: "My Task", icon: "mytask.png" },
        { menu: "Task Manager", icon: "taskmanager.png" },
        { menu: "User Manager", icon: "usermanager.png" },
        { menu: "My Profile", icon: "myprofile.png" }
    ];
    const roleOptions = [
        { role: 1, rolename: "User" },
        { role: 2, rolename: "Manager" },
        { role: 3, rolename: "Admin" }
    ];
    const menuOptions = [
        { mid: 2, menu: "MyTask" },
        { mid: 3, menu: "Task Manager" },
        { mid: 4, menu: "User Manager" },
        { mid: 6, menu: "Role Manager" },
        { mid: 5, menu: "My Profile" }
    ];

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token)
            logout();
        else{
            Promise.resolve().then(() => {
                setIsProgress(true);
                callApi("GET", apibaseurl + "/authservice/uinfo", null, null, loadUinfo, token);
            });
        }
    }, []);

    function getToken(){
        return localStorage.getItem("token") || "";
    }

    function loadUinfo(res){
        setIsProgress(false);
        if(res.code != 200)
            return;
        setFullname(res.fullname);
    }

    function logout(){
        localStorage.clear();
        window.location.replace("/");
    }

    function addRole(){
        if(roleName.trim() === ""){
            alert("Enter role name");
            return;
        }
        setIsProgress(true);
        callApi("POST", apibaseurl + "/roles", {rolename: roleName.trim()}, null, addRoleResponse, getToken());
    }

    function addRoleResponse(res){
        setIsProgress(false);
        alert(res.message || "Role added successfully");
        if(res.code === 200 || res.role)
            setRoleName("");
    }

    function addMenu(){
        if(menuName.trim() === ""){
            alert("Enter menu name");
            return;
        }
        setIsProgress(true);
        callApi("POST", apibaseurl + "/menus", {menuname: menuName.trim()}, null, addMenuResponse, getToken());
    }

    function addMenuResponse(res){
        setIsProgress(false);
        alert(res.message || "Menu added successfully");
        if(res.code === 200 || res.mid)
            setMenuName("");
    }

    function handleMenuSelection(mid){
        setSelectedMenus((prev)=> prev.includes(mid) ? prev.filter((m)=>m !== mid) : [...prev, mid]);
    }

    function mapRoleMenus(){
        if(selectedRole === ""){
            alert("Select role");
            return;
        }
        if(selectedMenus.length === 0){
            alert("Select at least one menu");
            return;
        }
        setIsProgress(true);
        callApi("POST", apibaseurl + "/role-mappings", {role: Number(selectedRole), menuIds: selectedMenus}, null, mapRoleMenusResponse, getToken());
    }

    function mapRoleMenusResponse(res){
        setIsProgress(false);
        alert(res.message || "Role menu mapping saved successfully");
        if(res.code === 200 || Array.isArray(res)){
            setSelectedRole("");
            setSelectedMenus([]);
        }
    }

    function renderContent(){
        switch(activeMenu){
            case "Dashboard":
                return (
                        <h2>Dashboard</h2>
                );
            case "My Task":
                return (
                   
                        <h2>My Task</h2>
                        
                );
            case "Task Manager":
                return (
                  
                        <h2>Task Manager</h2>
                        
                            
                );
            case "User Manager":
                return (
                   
                        <h2>User Manager</h2>
                        
                );
            case "My Profile":
                return (
                        <h2>My Profile</h2> 
                );
            case "Roles":
                return (
                    <div className='roles-content'>
                        <label>Content</label>
                        <div className='roles-box add-role-box'>
                            <label>Roles</label>
                            <input type='text' placeholder='Enter role name' value={roleName} onChange={(e)=>setRoleName(e.target.value)} />
                            <button onClick={()=>addRole()}>Add Role</button>
                        </div>
                        <label>Menu</label>
                        <div className='roles-box add-menu-box'>
                            <label>Menu</label>
                            <input type='text' placeholder='Enter menu name' value={menuName} onChange={(e)=>setMenuName(e.target.value)} />
                            <button onClick={()=>addMenu()}>Add Menu</button>
                        </div>
                        <label>Menu</label>
                        <div className='roles-box map-box'>
                            <div className='map-left'>
                                <label>Map Menu with Roles</label>
                                <select value={selectedRole} onChange={(e)=>setSelectedRole(e.target.value)}>
                                    <option value=''>Select Role</option>
                                    {roleOptions.map((role)=>(
                                        <option key={role.role} value={role.role}>{role.rolename}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='map-right'>
                                {menuOptions.map((menu)=>(
                                    <label key={menu.mid}><input type='checkbox' checked={selectedMenus.includes(menu.mid)} onChange={()=>handleMenuSelection(menu.mid)} /> <span>{menu.menu}</span></label>
                                ))}
                                <button onClick={()=>mapRoleMenus()}>Add</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div className='page-section'><h2>{activeMenu}</h2></div>;
        }
    }

    return (
        <div className='home'>
            <div className='home-header'>
                <img src="/logo.png" alt='' />
                <div className='info'>
                    {fullname}
                    <img src="/shutdown.png" alt='' onClick={()=>logout()} />
                </div>
            </div>
            <div className='home-workspace'>
                <div className='home-menus'>
                    <ul>
                        {sideMenus.map((m)=>(
                            <li key={m.mid || m.menu} className={activeMenu === m.menu ? 'active' : ''} onClick={()=>setActiveMenu(m.menu)}><img src={imgurl + m.icon} alt='' />{m.menu}</li>
                        ))}
                    </ul>
                    <div className={activeMenu === "Roles" ? 'role-menu-label active-role' : 'role-menu-label'} onClick={()=>setActiveMenu("Roles")}>Roles</div>
                </div>
                <div className='home-content'>{renderContent()}</div>
            </div>
            <div className='home-footer'>Copyright @ 2026. All rights reserved.</div>

            <ProgressBar isProgress={isProgress}/>
        </div>
    );
}

export default Home;