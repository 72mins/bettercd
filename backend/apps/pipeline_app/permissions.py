from rest_framework import permissions


class IsPipelineOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.pipeline.user == request.user
