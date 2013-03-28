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


 NOTE: The Google Maps API extension requirest JavaScript 1.6 or higher, due
    its dependence on the Array functions map, indexOf, and lastIndexOf
*/
Wkt.Wkt.prototype.isRectangle=false;
Wkt.Wkt.prototype.construct={point:function(config,component){var c=component||this.components;config=config||{};config.position=new google.maps.LatLng(c[0].y,c[0].x);return new google.maps.Marker(config)},multipoint:function(config){var i,c,arr;c=this.components;config=config||{};arr=[];for(i=0;i<c.length;i+=1)arr.push(this.construct.point(config,c[i]));return arr},linestring:function(config,component){var i,c;c=component||this.components;config=config||{editable:false};config.path=[];for(i=0;i<
c.length;i+=1)config.path.push(new google.maps.LatLng(c[i].y,c[i].x));return new google.maps.Polyline(config)},multilinestring:function(config){var i,c,arr;c=this.components;config=config||{editable:false};config.path=[];arr=[];for(i=0;i<c.length;i+=1)arr.push(this.construct.linestring(config,c[i]));return arr},polygon:function(config){var j,k,c,rings,verts;c=this.components;config=config||{editable:false};config.paths=[];rings=[];for(j=0;j<c.length;j+=1){verts=[];for(k=0;k<c[j].length;k+=1)verts.push(new google.maps.LatLng(c[j][k].y,
c[j][k].x));if(j!==0)if(config.reverseInnerPolygons==null||config.reverseInnerPolygons)verts.reverse();rings.push(verts)}config.paths=config.paths.concat(rings);if(this.isRectangle)console.log("Rectangles are not yet supported; set the isRectangle property to false (default).");else return new google.maps.Polygon(config)},multipolygon:function(config){var i,j,k,c,rings,verts;c=this.components;config=config||{editable:false};config.paths=[];for(i=0;i<c.length;i+=1){rings=[];for(j=0;j<c[i].length;j+=
1){verts=[];for(k=0;k<c[i][j].length;k+=1)verts.push(new google.maps.LatLng(c[i][j][k].y,c[i][j][k].x));rings.push(verts)}config.paths=config.paths.concat(rings)}return new google.maps.Polygon(config)}};
Wkt.Wkt.prototype.deconstruct=function(obj){var features,i,j,multiFlag,verts,rings,sign,tmp;sign=google.maps.geometry.spherical.computeSignedArea;if(obj.constructor===google.maps.Marker)return{type:"point",components:[{x:obj.getPosition().lng(),y:obj.getPosition().lat()}]};if(obj.constructor===google.maps.Polyline){verts=[];for(i=0;i<obj.getPath().length;i+=1){tmp=obj.getPath().getAt(i);verts.push({x:tmp.lng(),y:tmp.lat()})}return{type:"linestring",components:verts}}if(obj.constructor===google.maps.Polygon){rings=
[];multiFlag=function(){var areas,i,l;l=obj.getPaths().length;if(l<=1)return false;if(l===2){if(sign(obj.getPaths().getAt(0))*sign(obj.getPaths().getAt(0))<0)return false;return true}areas=obj.getPaths().getArray().map(function(k){return sign(k)/Math.abs(sign(k))});if(areas.indexOf(areas[0])!==areas.lastIndexOf(areas[0])){multiFlag=true;return true}return false}();for(i=0;i<obj.getPaths().length;i+=1){tmp=obj.getPaths().getAt(i);verts=[];for(j=0;j<obj.getPaths().getAt(i).length;j+=1)verts.push({x:tmp.getAt(j).lng(),
y:tmp.getAt(j).lat()});if(!tmp.getAt(tmp.length-1).equals(tmp.getAt(0)))verts.push({x:tmp.getAt(0).lng(),y:tmp.getAt(0).lat()});if(obj.getPaths().length>1&&i>0)if(sign(obj.getPaths().getAt(i))>0&&sign(obj.getPaths().getAt(i-1))>0||sign(obj.getPaths().getAt(i))<0&&sign(obj.getPaths().getAt(i-1))<0)verts=[verts];if(multiFlag)rings.push([verts]);else rings.push(verts)}return{type:multiFlag?"multipolygon":"polygon",components:rings}}if(obj.constructor===google.maps.Rectangle){tmp=obj.getBounds();return{type:"polygon",
isRectangle:true,components:[[{x:tmp.getSouthWest().lng(),y:tmp.getNorthEast().lat()},{x:tmp.getNorthEast().lng(),y:tmp.getNorthEast().lat()},{x:tmp.getNorthEast().lng(),y:tmp.getSouthWest().lat()},{x:tmp.getSouthWest().lng(),y:tmp.getSouthWest().lat()},{x:tmp.getSouthWest().lng(),y:tmp.getNorthEast().lat()}]]}}if(Wkt.isArray(obj)){features=[];for(i=0;i<obj.length;i+=1)features.push(this.deconstruct.call(this,obj[i]));return{type:function(){var k,type=obj[0].constructor;for(k=0;k<obj.length;k+=1)if(obj[k].constructor!==
type)return"geometrycollection";switch(type){case google.maps.Marker:return"multipoint";case google.maps.Polyline:return"multilinestring";case google.maps.Polygon:return"multipolygon";default:return"geometrycollection"}}(),components:function(){var i,comps;comps=[];for(i=0;i<features.length;i+=1)if(features[i].components)comps.push(features[i].components);return comps}()}}if(obj.getBounds&&obj.getRadius)console.log("Deconstruction of google.maps.Circle objects is not yet supported");else console.log("The passed object does not have any recognizable properties.")};
