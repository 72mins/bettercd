from rest_framework import permissions


class IsStageOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.pipeline.user == request.user
