from rest_framework import serializers

class MovieSerializer(serializers.Serializer):
   
    _id = serializers.CharField(read_only=True)
    tmdb_id = serializers.IntegerField()
    title = serializers.CharField()
    overview = serializers.CharField(allow_blank=True)
    poster_path = serializers.URLField(allow_null=True)
    backdrop_path = serializers.URLField(allow_null=True)
    release_date = serializers.CharField(allow_blank=True)
    vote_average = serializers.FloatField()
    vote_count = serializers.IntegerField()
    popularity = serializers.FloatField()
    original_language = serializers.CharField()
    genre_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    
    genres = serializers.ListField(child=serializers.DictField(), required=False)
    runtime = serializers.IntegerField(required=False, allow_null=True)
    budget = serializers.IntegerField(required=False, allow_null=True)
    revenue = serializers.IntegerField(required=False, allow_null=True)
    status = serializers.CharField(required=False, allow_null=True)
    tagline = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    imdb_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    homepage = serializers.URLField(required=False, allow_null=True)
    
    cast = serializers.ListField(child=serializers.DictField(), required=False)
    crew = serializers.ListField(child=serializers.DictField(), required=False)
    videos = serializers.ListField(child=serializers.DictField(), required=False)
    recommendations = serializers.ListField(child=serializers.DictField(), required=False)
    
    user_data = serializers.DictField(required=False)


class UserMovieDataSerializer(serializers.Serializer):
    
    _id = serializers.CharField(read_only=True)
    user_id = serializers.IntegerField()
    tmdb_id = serializers.IntegerField()
    favorite = serializers.BooleanField(default=False)
    watchlist = serializers.BooleanField(default=False)
    watched = serializers.BooleanField(default=False)
    rating = serializers.FloatField(allow_null=True)


class RatingSerializer(serializers.Serializer):
    
    rating = serializers.FloatField(min_value=0, max_value=10)