import strawberry
from pythonit_toolkit.api.extensions import SentryExtension
from users.api.types import (
    BlogPostAuthor,
    ScheduleItemUser,
    SubmissionCommentAuthor,
    SubmissionSpeaker,
)

from .mutation import Mutation
from .query import Query

schema = strawberry.federation.Schema(
    Query,
    Mutation,
    types=[
        ScheduleItemUser,
        SubmissionSpeaker,
        BlogPostAuthor,
        SubmissionCommentAuthor,
    ],
    extensions=[SentryExtension],
)
