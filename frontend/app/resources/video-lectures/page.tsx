"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { videoLectureService, VideoLecture } from "@/lib/videoLectureService";
import { FaPlay, FaUser, FaClock, FaEye, FaYoutube, FaListUl, FaGraduationCap } from "react-icons/fa";



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
            src="/bg.svg"
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
              Comprehensive video lectures and playlists to enhance your learning
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-end mb-8">
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[200px] bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md hover:shadow-lg transition-shadow rounded-lg">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[99999] rounded-lg shadow-xl border border-gray-200">
                <SelectItem value="All">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && <LoadingSpinner />}
          {!loading && displayVideos.length > 0 ? (
            selectedLevel === "All" ? (
              <div className="space-y-16">
                {levels.map((level) => {
                  const levelVideos = videosByLevel[level];
                  if (levelVideos.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <div className="mb-8 pb-4 border-b-2 border-gray-300">
                        <div className="flex items-center gap-3">
                          <FaGraduationCap className="w-8 h-8 text-gray-800" />
                          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-bold text-gray-900 leading-tight tracking-tight">
                            {level}
                          </h2>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {levelVideos.map((video) => {
                          const thumbnail = video.thumbnailUrl || '/placeholder-video.svg';
                          return (
                          <Card 
                            key={video.id} 
                            className="relative overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer rounded-xl"
                            onClick={() => handleVideoClick(video)}
                          >
                            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-900">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={thumbnail}
                                alt={video.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-video.svg';
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                              
                              <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                                <Badge className={`${video.videoType === 'playlist' ? 'bg-purple-600' : 'bg-red-600'} text-white font-bold px-2.5 py-1 text-[10px] uppercase tracking-wide flex items-center gap-1.5 shadow-lg`}>
                                  {video.videoType === 'playlist' ? (
                                    <>
                                      <FaListUl className="w-2.5 h-2.5" />
                                      <span>Playlist</span>
                                    </>
                                  ) : (
                                    <>
                                      <FaYoutube className="w-3 h-3" />
                                      <span>Video</span>
                                    </>
                                  )}
                                </Badge>
                              </div>

                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                                  <FaPlay className="w-6 h-6 text-red-600 ml-1" />
                                </div>
                              </div>

                              {video.duration && (
                                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold flex items-center gap-1">
                                  <FaClock className="w-3 h-3" />
                                  {video.duration}
                                </div>
                              )}
                            </div>
                            
                            <div className="p-4">
                              <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                                {video.title}
                              </h3>

                              <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed min-h-[2rem]">
                                {video.description}
                              </p>

                              <div className="border-t border-gray-200 pt-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                    {video.subject}
                                  </span>
                                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                                    <FaEye className="w-3 h-3" />
                                    <span className="font-medium">{video.views || 0}</span>
                                  </div>
                                </div>
                                
                                {video.instructor && (
                                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                                    <FaUser className="w-3 h-3" />
                                    <span className="font-medium truncate">{video.instructor}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayVideos.map((video) => {
                  const thumbnail = video.thumbnailUrl || '/placeholder-video.svg';
                  return (
                  <Card 
                    key={video.id} 
                    className="relative overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer rounded-xl"
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-video.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                        <Badge className={`${video.videoType === 'playlist' ? 'bg-purple-600' : 'bg-red-600'} text-white font-bold px-2.5 py-1 text-[10px] uppercase tracking-wide flex items-center gap-1.5 shadow-lg`}>
                          {video.videoType === 'playlist' ? (
                            <>
                              <FaListUl className="w-2.5 h-2.5" />
                              <span>Playlist</span>
                            </>
                          ) : (
                            <>
                              <FaYoutube className="w-3 h-3" />
                              <span>Video</span>
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                          <FaPlay className="w-6 h-6 text-red-600 ml-1" />
                        </div>
                      </div>

                      {video.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold flex items-center gap-1">
                          <FaClock className="w-3 h-3" />
                          {video.duration}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                        {video.title}
                      </h3>

                      <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed min-h-[2rem]">
                        {video.description}
                      </p>

                      <div className="border-t border-gray-200 pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-wide">
                            {video.subject}
                          </span>
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <FaEye className="w-3 h-3" />
                            <span className="font-medium">{video.views || 0}</span>
                          </div>
                        </div>
                        
                        {video.instructor && (
                          <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                            <FaUser className="w-3 h-3" />
                            <span className="font-medium truncate">{video.instructor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
                })}
              </div>
            )
          ) : !loading ? (
            <Card className="p-12 text-center border border-gray-200 bg-white rounded-xl shadow-lg">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaPlay className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Videos Found</h3>
              <p className="text-gray-600">Check back later for new video lectures</p>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
}
