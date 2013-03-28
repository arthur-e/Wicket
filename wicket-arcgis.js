/*


  Copyright (C) 2012 K. Arthur Endsley (kaendsle@mtu.edu)
  Michigan Tech Research Institute (MTRI)
  3600 Green Court, Suite 100, Ann Arbor, MI, 48105

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.


 NOTE: The ESRI ArcGIS API extension requirest JavaScript 1.6 or higher, due
  its dependence on the Array functions map, indexOf, and lastIndexOf
*/
Wkt.Wkt.prototype.isRectangle=false;
Wkt.Wkt.prototype.construct={point:function(config,component){var coord=component||this.components;if(coord instanceof Array)coord=coord[0];if(config)coord.spatialReference=config.spatialReference||config.srs;return new esri.geometry.Point(coord)},multipoint:function(config){config=config||{};if(!config.spatialReference&&config.srs)config.spatialReference=config.srs;return new esri.geometry.Multipoint({points:this.components.map(function(i){if(Wkt.isArray(i))i=i[0];return[i.x,i.y]}),spatialReference:config.spatialReference})},
linestring:function(config){config=config||{};if(!config.spatialReference&&config.srs)config.spatialReference=config.srs;return new esri.geometry.Polyline({paths:[this.components.map(function(i){return[i.x,i.y]})],spatialReference:config.spatialReference})},multilinestring:function(config){config=config||{};if(!config.spatialReference&&config.srs)config.spatialReference=config.srs;return new esri.geometry.Polyline({paths:this.components.map(function(i){return i.map(function(j){return[j.x,j.y]})}),
spatialReference:config.spatialReference})},polygon:function(config){config=config||{};if(!config.spatialReference&&config.srs)config.spatialReference=config.srs;return new esri.geometry.Polygon({rings:this.components.map(function(i){return i.map(function(j){return[j.x,j.y]})}),spatialReference:config.spatialReference})},multipolygon:function(config){var that=this;config=config||{};if(!config.spatialReference&&config.srs)config.spatialReference=config.srs;return new esri.geometry.Polygon({rings:function(){var i,
j,holey,newRings,rings;holey=false;rings=that.components.map(function(i){var rings=i.map(function(j){return j.map(function(k){return[k.x,k.y]})});holey=rings.length>1;return rings});if(!holey&&rings[0].length>1)return rings;newRings=[];for(i=0;i<rings.length;i+=1)if(rings[i].length>1)for(j=0;j<rings[i].length;j+=1)newRings.push(rings[i][j]);else newRings.push(rings[i][0]);return newRings}(),spatialReference:config.spatialReference})}};
Wkt.isInnerRingOf=function(ring1,ring2,srs){var contained,i,ply,pnt;contained=true;ply=new esri.geometry.Polygon({rings:ring2.map(function(i){return i.map(function(j){return[j.x,j.y]})}),spatialReference:srs});for(i=0;i<ring1.length;i+=1){pnt=new esri.geometry.Point(ring1[i].x,ring1[i].y,srs);if(!ply.contains(pnt)){contained=false;break}}return contained};
Wkt.Wkt.prototype.deconstruct=function(obj){var i,j,paths,rings,verts;if(obj.constructor===esri.geometry.Point)return{type:"point",components:[{x:obj.getLongitude(),y:obj.getLatitude()}]};if(obj.constructor===esri.geometry.Multipoint){verts=[];for(i=0;i<obj.points.length;i+=1)verts.push([{x:obj.points[i][0],y:obj.points[i][1]}]);return{type:"multipoint",components:verts}}if(obj.constructor===esri.geometry.Polyline){paths=[];for(i=0;i<obj.paths.length;i+=1){verts=[];for(j=0;j<obj.paths[i].length;j+=
1)verts.push({x:obj.paths[i][j][0],y:obj.paths[i][j][1]});paths.push(verts)}if(obj.paths.length>1)return{type:"multilinestring",components:paths};return{type:"linestring",components:verts}}if(obj.constructor===esri.geometry.Polygon){rings=[];for(i=0;i<obj.rings.length;i+=1){verts=[];for(j=0;j<obj.rings[i].length;j+=1)verts.push({x:obj.rings[i][j][0],y:obj.rings[i][j][1]});if(i>0)if(Wkt.isInnerRingOf(verts,rings[i-1],obj.spatialReference))rings[rings.length-1].push(verts);else rings.push([verts]);
else rings.push([verts])}if(rings.length>1)return{type:"multipolygon",components:rings};return{type:"polygon",components:rings[0]}}};
