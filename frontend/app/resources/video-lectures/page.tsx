"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Video, User, Clock } from "lucide-react";
import { videoLectureService, VideoLecture } from "@/lib/videoLectureService";

const levels = ['Foundation', 'Diploma', 'BSc', 'BS'];

export default function VideoLecturesPage() {
  const [videosData, setVideosData] = useState<VideoLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await videoLectureService.getPublishedVideoLectures();
      setVideosData(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = async (video: VideoLecture) => {
    if (video.id) {
      await videoLectureService.incrementViews(video.id);
    }
    window.open(video.videoUrl, '_blank');
  };

  const videosByLevel = levels.reduce((acc, level) => {
    acc[level] = videosData.filter(v => v.level === level);
    return acc;
  }, {} as Record<string, VideoLecture[]>);

  const displayVideos = selectedLevel === "All" 
    ? videosData 
    : videosData.filter(v => v.level === selectedLevel);

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/resource-hub-bg.svg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-[60]">
          <Navbar />
        </div>

        <div className="relative z-10 py-12 px-6 md:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Video Lectures
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Access comprehensive video lectures and playlists to enhance your learning
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-700 font-medium">
              Showing <span className="text-gray-900 font-bold">{displayVideos.length}</span> video{displayVideos.length !== 1 ? 's' : ''}
            </p>
            
            <div className="flex items-center gap-3">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[200px] bg-white border-2 border-gray-900">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[99999]">
                  <SelectItem value="All">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && <LoadingSpinner />}
          {!loading && displayVideos.length > 0 ? (
            selectedLevel === "All" ? (
              <div className="space-y-12">
                {levels.map((level) => {
                  const levelVideos = videosByLevel[level];
                  if (levelVideos.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        {level}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {levelVideos.map((video) => (
                          <Card 
                            key={video.id} 
                            className="relative overflow-hidden border-2 border-gray-900 shadow-lg hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
                            onClick={() => handleVideoClick(video)}
                          >
                            <div className="relative z-10 p-5 flex flex-col h-full">
                              <div className="flex items-start justify-between mb-3">
                                <Badge className={`${video.videoType === 'playlist' ? 'bg-purple-600' : 'bg-red-600'} text-white font-medium px-2 py-1 text-xs`}>
                                  {video.videoType === 'playlist' ? 'Playlist' : 'Video'}
                                </Badge>
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 text-white fill-white" />
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 flex-grow">
                                {video.title}
                              </h3>

                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {video.description}
                              </p>

                              <div className="space-y-2 mt-auto">
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                  <span className="font-medium bg-purple-100 px-2 py-1 rounded">{video.subject}</span>
                                  {video.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{video.duration}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {video.instructor && (
                                  <div className="flex items-center text-xs text-gray-600">
                                    <User className="w-3 h-3 mr-1" />
                                    <span>{video.instructor}</span>
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                                  <div className="flex items-center gap-1">
                                    <Play className="w-3 h-3" />
                                    <span>{video.views || 0} views</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="relative overflow-hidden border-2 border-gray-900 shadow-lg hover:shadow-xl transition-all group cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="relative z-10 p-5 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${video.videoType === 'playlist' ? 'bg-purple-600' : 'bg-red-600'} text-white font-medium px-2 py-1 text-xs`}>
                          {video.videoType === 'playlist' ? 'Playlist' : 'Video'}
                        </Badge>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 flex-grow">
                        {video.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {video.description}
                      </p>

                      <div className="space-y-2 mt-auto">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="font-medium bg-purple-100 px-2 py-1 rounded">{video.subject}</span>
                          {video.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{video.duration}</span>
                            </div>
                          )}
                        </div>
                        
                        {video.instructor && (
                          <div className="flex items-center text-xs text-gray-600">
                            <User className="w-3 h-3 mr-1" />
                            <span>{video.instructor}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                          <div className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            <span>{video.views || 0} views</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          ) : !loading ? (
            <Card className="p-12 text-center border-2 border-gray-900 bg-white">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Found</h3>
              <p className="text-gray-600">Check back later for new video lectures</p>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
}
