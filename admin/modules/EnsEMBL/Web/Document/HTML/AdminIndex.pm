=head1 LICENSE

Copyright [1999-2015] Wellcome Trust Sanger Institute and the EMBL-European Bioinformatics Institute
Copyright [2016-2017] EMBL-European Bioinformatics Institute

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

=cut

package EnsEMBL::Web::Document::HTML::AdminIndex;

use strict;

use parent qw(EnsEMBL::Web::Document::HTML);

sub new {
  my $self = shift->SUPER::new;
  $self->{'hub'} = shift;
  return $self;
}

sub render {
  my $self  = shift;
  my $hub   = $self->{'hub'};
  my $user  = $hub->user;

  return '<div class="plain-box"><p>Note that for access to the database frontends, you will need
   to <a href="/Account/Login" class="modal_link">log in</a> (using the same account as www.ensembl.org) and be
   a member of the appropriate user group.</p></div>' unless $user;

  return '<div class="plain-box"><p>Your user account seems to have limited rights that excludes
  access to the database frontends and healthcheck interface. If you need access to these pages,
  please ask you team leader.</p></div>' unless $user->is_member_of($hub->species_defs->ENSEMBL_WEBADMIN_ID);

  return q(
<div class="admin-left-box"><div class="plain-box">
  <h1>Declarations of Intentions</h1>
  <ul>
    <li><a href="/Changelog/Summary">View all declarations</a></li>
    <li><a href="/Changelog/Add">Add a declaration</a></li>
    <li><a href="/Changelog/ListReleases?pull=1">Copy a declaration from a previous release</a></li>
    <li><a href="/Changelog/Select/Edit">Update a declaration</a></li>
    <li><a href="/Changelog/List">Declarations - quick lookup table</a></li>
  </ul>
  <h1>Ensembl Production Database</h1>
  <ul>
    <li><a href="/Production/AnalysisWebData">Analysis WebData</a></li>
    <li><a href="/AnalysisDesc/List">Analysis Description</a></li>
    <li><a href="/Species/List">Species</a></li>
    <li><a href="/SpeciesAlias/List">Species alias</a></li>
    <li><a href="/Metakey/List">Meta keys</a></li>
    <li><a href="/Biotype/Display">Biotypes</a></li>
    <li><a href="/Webdata/Display">Web Data</a></li>
    <li><a href="/AttribType/Display">AttribType</a></li>
    <li><a href="/Attrib/Display">Attrib</a></li>
    <li><a href="/AttribSet/Display">AttribSet</a></li>
    <li><a href="/ExternalDb/Display">ExternalDb</a></li>
  </ul>
  <h1>Help Database</h1>
  <ul>
    <li><a href="/HelpRecord/List/View">Page View</a></li>
    <li><a href="/HelpRecord/List/FAQ">FAQ</a></li>
    <li><a href="/HelpRecord/List/Glossary">Glossary</a></li>
    <li><a href="/HelpRecord/List/Movie">Movies</a></li>
  </ul>
  <h1>Documents</h1>
  <ul>
    <li><a href="/Documents/View/Testcases">Healthcheck Testcases</a></li>
  </ul>
  <h1>User Directory</h1>
  <ul>
    <li><a href="/UserDirectory">User Directory</a></li>
  </ul>
  <h1>Performance</h1>
  <ul>
    <li><a href="/tools_graphs/index.html">Tools LSF queues load</a>
      <ul>
        <li><a href="/tools_graphs/index.html?type=Blast">Blast</a></li>
        <li><a href="/tools_graphs/index.html?type=Blat">Blat</a></li>
        <li><a href="/tools_graphs/index.html?type=VEP">VEP</a></li>
        <li><a href="/tools_graphs/index.html?type=FileChameleon">FileChameleon</a></li>
        <li><a href="/tools_graphs/index.html?type=AlleleFrequency">AlleleFrequency</a></li>
        <li><a href="/tools_graphs/index.html?type=VcftoPed">VcftoPed</a></li>
        <li><a href="/tools_graphs/index.html?type=DataSlicer">DataSlicer</a></li>
        <li><a href="/tools_graphs/index.html?type=VariationPattern">VariationPattern</a></li>
      </ul>
    </li>
    <li><a href="/perf">Nightly local full page-load times</a></li>
    <li><a href="/arewestable">Live server error monitoring (BETA)</a></li>
  </ul>
  <h1>Disk usage</h1>
  <ul>
    <li><a href="/disk_usage/compara.html">Compara</a></li>
    <li><a href="/disk_usage/genebuild.html">Genebuild</a></li>
    <li><a href="/disk_usage/production.html">Production</a></li>
    <li><a href="/disk_usage/regulation.html">Regulation</a></li>
    <li><a href="/disk_usage/variation.html">Variation</a></li>
    <li><a href="/disk_usage/web.html">Web</a></li>
  </ul>
</div></div>);

}

1;
