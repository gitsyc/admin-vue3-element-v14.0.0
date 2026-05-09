import { AppRouteRecord } from '@/types/router'
import { organizationTemplateRoutes } from './organization-template'
import { permissionTemplateRoutes } from './permission-template'
import { systemConfigRoutes } from './system-config'

export const routeModules: AppRouteRecord[] = [
  organizationTemplateRoutes,
  permissionTemplateRoutes,
  systemConfigRoutes
]
