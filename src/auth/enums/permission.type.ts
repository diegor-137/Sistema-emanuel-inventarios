import { empleadoPermission } from "./empleadoPermission"
import { userPermission } from "./userPermission"

const Permission = { 
    ...empleadoPermission,
    ...userPermission
}
type Permission = empleadoPermission | userPermission;
export default Permission;