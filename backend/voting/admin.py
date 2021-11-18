from dal_admin_filters import AutocompleteFilter
from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from users.client import get_users_data_by_ids
from voting.models import RankRequest, RankSubmission, Vote


class SubmissionFilter(AutocompleteFilter):
    title = "Submission"
    field_name = "submission"
    autocomplete_url = "submission-autocomplete"


class ConferenceFilter(AutocompleteFilter):
    title = "Conference"
    field_name = "submission__conference"
    autocomplete_url = "submission-conference-autocomplete"


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("submission", "user_id", "value")
    list_filter = (SubmissionFilter, "value")
    search_fields = (
        "submission__title",
        "user_id",
    )

    class Media:
        js = ["admin/js/jquery.init.js"]


@admin.register(RankSubmission)
class RankSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "absolute_rank",
        "absolute_score",
        "duration",
        "title",
        "type",
        "topic",
        "topic_rank",
        "level",
        "language",
        "speaker",
        "gender",
        "view_submission",
    )
    ordering = ("absolute_rank",)
    list_filter = (
        "rank_request_id",
        "submission__type",
        "submission__topic",
        "submission__duration",
    )

    def title(self, obj):
        return obj.submission.title

    def type(self, obj):
        return obj.submission.type

    def topic(self, obj):
        return obj.submission.topic.name

    def level(self, obj):
        return obj.submission.audience_level.name

    def duration(self, obj):
        return obj.submission.duration.duration

    def language(self, obj):
        emoji = {"it": "🇮🇹", "en": "🇬🇧"}
        langs = [emoji[lang.code] for lang in obj.submission.languages.all()]
        return " ".join(langs)

    def speaker(self, obj):
        return obj.submission.speaker_id

    def gender(self, obj):
        emoji = {
            "": "",
            "male": "👨🏻‍💻",
            "female": "👩🏼‍💻",
            "other": "🧑🏻‍🎤",
            "not_say": "⛔️",
        }
        speaker_gender = self._users_by_id[str(obj.speaker_id)]["gender"]
        return emoji[speaker_gender]

    def view_submission(self, obj):  # pragma: no cover
        return format_html(
            '<a class="button" ' 'href="{{}}" target="_blank" >Open</a>&nbsp;',
            reverse("admin:submissions_submission_change", args=(obj.submission.id,)),
        )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        speaker_ids = queryset.values_list("speaker_id", flat=True)
        self._users_by_id = get_users_data_by_ids(list(speaker_ids))
        return queryset

    view_submission.short_description = "View"
    view_submission.allow_tags = True


@admin.register(RankRequest)
class RankRequestAdmin(admin.ModelAdmin):
    list_display = ("conference", "created", "view_rank")

    def view_rank(self, obj):
        return format_html(
            f'<a class="button" '
            f'href="{{}}?rank_request_id__id__exact={obj.id}">Open</a>&nbsp;',
            reverse("admin:voting_ranksubmission_changelist"),
        )

    view_rank.short_description = "View"
    view_rank.allow_tags = True
