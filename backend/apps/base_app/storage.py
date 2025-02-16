from storages.backends.s3boto3 import S3Boto3Storage
import os


class UserMediaStorage(S3Boto3Storage):
    def get_available_name(self, name, max_length=None):
        from crum import get_current_request

        request = get_current_request()

        if request and hasattr(request, "user") and request.user.is_authenticated:
            user_id = request.user.id
        else:
            user_id = "anonymous"

        name = os.path.join(str(user_id), name)

        return super().get_available_name(name, max_length)
