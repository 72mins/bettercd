from rest_framework import pagination
from rest_framework.response import Response
from rest_framework import status


class ClassicPagination(pagination.PageNumberPagination):
    page_size = 10
    page_query_param = "page"

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "current_page": self.page.number,
                "page_size": self.page_size,
                "results": data,
            },
            status=status.HTTP_200_OK,
        )
