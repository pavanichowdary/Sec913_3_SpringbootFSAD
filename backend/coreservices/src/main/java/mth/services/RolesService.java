package mth.services;

import mth.models.Roles;
import mth.models.Users;
import mth.repository.RolesRepository;

public class RolesService {
	
	RolesRepository RR;
	
	public Object addRole(Roles R)
	{
		RR.save(R);
	}
}
